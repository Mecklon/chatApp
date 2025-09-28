package com.mecklon.backend.model;


// this enum is represented either in number format or string formate
// it depends on how the model that uses this enum annotates it
// if @Enumeration(enumType.ORDINAL) then number if enumType.STRING then string
public enum NotificationType {
    GROUP_MESSAGE,
    FRIEND_MESSAGE,
    SYS_MESSAGE
}
